# frozen_string_literal: true

module MatildaCore

  module Authentication

    # SignupCommand.
    # Permette ad un utente di registrarsi all'interno della piattaforma.
    class SignupCommand < MatildaCore::ApplicationCommand

      attr_reader :session_uuid, :user_uuid

      validates :username,
                presence: true, type: :string, blank: false,
                regex: MatildaCore::User::USERNAME_REGEX,
                err: 'Username non valido'

      validates :email,
                presence: true, type: :string, blank: false,
                regex: MatildaCore::User::EMAIL_REGEX,
                err: 'Email non valida'

      validates :name,
                presence: true, type: :string, blank: false,
                err: 'Nome non valido'

      validates :surname,
                presence: true, type: :string, blank: false,
                err: 'Cognome non valido'

      validates :password,
                presence: true, type: :string, blank: false,
                err: 'Password non valida' # TODO: Aggiungere Regex password.

      validates :password_confirmation,
                presence: true, type: :string, blank: false,
                err: 'Password non valida' # TODO: Aggiungere Regex password.

      validates :ip_address, type: :string

      validates :log_who, type: :string

      to_normalize_params do
        params[:email] = params[:email].downcase
      end

      to_validate_params do
        # verifico che le due password siano uguali
        if params[:password] != params[:password_confirmation]
          err('Le due password non coincidono', code: :password_confirmation)
          break
        end
      end

      to_validate_logic do
        # verifico che l'username sia univoco
        if MatildaCore::User.find_by(username: params[:username])
          err('Username già utilizzato', code: :username)
          break
        end

        # verifico che la email sia univoca
        if MatildaCore::UserEmail.find_by(email: params[:email])
          err('Email già utilizzata', code: :email)
          break
        end
      end

      to_initialize_events do
        @session_uuid = SecureRandom.uuid
        @user_uuid = SecureRandom.uuid

        # creo il nuovo utente
        event_user = MatildaCore::Users::CreateEvent.new(
          user_uuid: @user_uuid,
          username: params[:username],
          name: params[:name],
          surname: params[:surname],
          password: BCrypt::Password.create(params[:password]),
          log_who: params[:log_who]
        )
        internal_error && break unless event_user.saved?

        # memorizzo l'indirizzo email del nuovo utente
        event_email = MatildaCore::Users::CreateEmailEvent.new(
          user_uuid: @user_uuid,
          email: params[:email],
          primary: true,
          log_who: params[:log_who]
        )
        internal_error && break unless event_email.saved?

        # creo una nuova sessione
        event_session = MatildaCore::Users::CreateSessionEvent.new(
          session_uuid: @session_uuid,
          user_uuid: @user_uuid,
          ip_address: params[:ip_address],
          log_who: params[:log_who]
        )
        internal_error && break unless event_session.saved?

        # aggiungo l'utente al gruppo di default se è stato specificato
        if MatildaCore.config.authentication_signup_default_group_uuid && MatildaCore::Group.find_by(uuid: MatildaCore.config.authentication_signup_default_group_uuid)
          event_membership = MatildaCore::Memberships::CreateEvent.new(
            user_uuid: @user_uuid,
            group_uuid: MatildaCore.config.authentication_signup_default_group_uuid,
            log_who: params[:log_who]
          )
          internal_error && break unless event_membership.saved?

          # aggiorno i permessi
          if MatildaCore.config.authentication_signup_default_group_permissions&.length&.positive?
            event_permissions = MatildaCore::Memberships::EditPermissionsEvent.new(
              user_uuid: @user_uuid,
              group_uuid: MatildaCore.config.authentication_signup_default_group_uuid,
              permissions: MatildaCore.config.authentication_signup_default_group_permissions,
              log_who: params[:log_who]
            )
            internal_error && break unless event_permissions.saved?
          end
        end
      end

    end

  end

end
