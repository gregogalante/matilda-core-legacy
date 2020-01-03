# frozen_string_literal: true

module MatildaCore

  module Groups

    # CreateGroupCommand.
    # Permette di creare un nuovo gruppo.
    # Se viene creato da un utente specifico allora aggiunge l'utente al gruppo.
    class CreateGroupCommand < MatildaCore::ApplicationCommand

      attr_reader :group_uuid

      validates :name,
                presence: true, type: :string, blank: false,
                err: 'Nome non valido'

      validates :user_uuid, type: :string

      validates :log_who, type: :string

      to_validate_logic do
        if params[:user_uuid]
          unless MatildaCore.config.groups_permit_creation_to_users
            err('Non possono essere creati gruppi', code: :user_uuid)
            break
          end

          if MatildaCore::Membership.where(user_uuid: params[:user_uuid]).length >= MatildaCore.config.groups_max_number_per_user
            err('Hai raggiunto il numero massimo di gruppi', code: :user_uuid)
            break
          end
        end
      end

      to_initialize_events do
        @group_uuid = SecureRandom.uuid

        event_creation = MatildaCore::Groups::CreateEvent.new(
          group_uuid: @group_uuid,
          name: params[:name],
          log_who: params[:log_who]
        )
        internal_error && break unless event_creation.saved?

        if params[:user_uuid]
          event_membership = MatildaCore::Memberships::CreateEvent.new(
            user_uuid: params[:user_uuid],
            group_uuid: @group_uuid,
            log_who: params[:log_who]
          )
          internal_error && break unless event_membership.saved?
        end
      end

    end

  end

end
