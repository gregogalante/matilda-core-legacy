# frozen_string_literal: true

module MatildaCore

  module Profile

    # EditInfoCommand.
    class EditInfoCommand < MatildaCore::ApplicationCommand

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :name,
                presence: true, type: :string, blank: false,
                err: 'Nome non valido'

      validates :surname,
                presence: true, type: :string, blank: false,
                err: 'Nome non valido'

      validates :log_who, type: :string

      to_validate_logic do
        # verifico che l'utente esista
        unless MatildaCore::User.find_by(uuid: params[:user_uuid])
          err('Utente non valido', code: :user_uuid)
          break
        end
      end

      to_initialize_events do
        event = MatildaCore::Users::EditInfoEvent.new(
          user_uuid: params[:user_uuid],
          name: params[:name],
          surname: params[:surname],
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
