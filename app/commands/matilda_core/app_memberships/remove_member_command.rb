# frozen_string_literal: true

module MatildaCore

  module AppMemberships

    # RemoveMemberCommand.
    # Rimuove un utente dal gruppo.
    class RemoveMemberCommand < MatildaCore::ApplicationCommand

      validates :group_uuid,
                presence: true, type: :string, blank: false,
                err: 'Gruppo non valido'

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :log_who, type: :string

      to_validate_logic do
        @user = MatildaCore::User.find_by(uuid: params[:user_uuid])

        # verifico che l'utente non sia già fuori dal gruppo
        unless @user && MatildaCore::Membership.find_by(user_uuid: @user.uuid, group_uuid: params[:group_uuid])
          err("L'utente non è all'interno del gruppo", code: :user_uuid)
          break
        end
      end

      to_initialize_events do
        # TODO
      end

    end

  end

end
