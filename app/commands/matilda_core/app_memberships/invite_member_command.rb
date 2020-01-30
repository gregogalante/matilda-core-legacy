# frozen_string_literal: true

module MatildaCore

  module AppMemberships

    # InviteMemberCommand.
    # Invita un utente ad unirsi ad un gruppo.
    class InviteMemberCommand < MatildaCore::ApplicationCommand

      attr_reader :user_uuid

      validates :group_uuid,
                presence: true, type: :string, blank: false,
                err: 'Gruppo non valido'

      validates :name,
                presence: true, type: :string, blank: false,
                err: 'Nome non valido'

      validates :surname,
                presence: true, type: :string, blank: false,
                err: 'Cognome non valido'

      validates :email,
                presence: true, type: :string, blank: false,
                regex: MatildaCore::User::EMAIL_REGEX,
                err: 'Email non valida'

      validates :log_who, type: :string

      to_normalize_params do
        params[:email] = params[:email].downcase
      end

      to_validate_logic do
        @user_uuid = MatildaCore::UserEmail.find_by(email: params[:email])&.user_uuid

        # se l'utente esiste gia' verifico che non sia gia' dentro il gruppo
        if @user_uuid && MatildaCore::Membership.find_by(user_uuid: @user_uuid, group_uuid: params[:group_uuid])
          err("L'utente è gia all'interno del gruppo", code: :email)
          break
        end
      end

      to_initialize_events do
        unless @user_uuid
          @user_uuid = SecureRandom.uuid

          # creo il nuovo utente
          event_user = MatildaCore::Users::CreateEvent.new(
            user_uuid: @user_uuid,
            username: @user_uuid,
            name: params[:name],
            surname: params[:surname],
            password: nil,
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
        end

        # invito l'utente al gruppo
        event_membership = MatildaCore::Memberships::CreateEvent.new(
          user_uuid: @user_uuid,
          group_uuid: params[:group_uuid],
          log_who: params[:log_who]
        )
        internal_error && break unless event_membership.saved?
      end

    end

  end

end
