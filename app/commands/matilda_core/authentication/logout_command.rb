# frozen_string_literal: true

module MatildaCore

  module Authentication

    # LogoutCommand.
    class LogoutCommand < MatildaCore::ApplicationCommand

      validates :session_uuid,
                presence: true, type: :string, blank: false,
                err: 'Sessione non valida'

      validates :log_who, type: :string

      to_initialize_events do
        event_session = MatildaCore::Users::RemoveSessionEvent.new(
          session_uuid: params[:session_uuid],
          log_who: params[:log_who]
        )
        internal_error && break unless event_session.saved?
      end

    end

  end

end
