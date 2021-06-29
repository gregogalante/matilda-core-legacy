# frozen_string_literal: true

module MatildaCore

  # MembershipsController.
  class MembershipsController < MatildaCore::ApplicationController

    before_action do
      if session_present_check(:group_uuid)
        redirect_to matilda_core.root_path unless session_permission_present?(['matilda_core.memberships'])
      end
    end

    def index_view
      @users = @session.group.users
      @users = @users.where('lower(name) LIKE ? OR lower(surname) LIKE ?', "%#{params[:s].downcase}%", "%#{params[:s].downcase}%") unless params[:s].blank?
      @users = @users.order('surname ASC, name ASC').page(params[:page]).per(15)
    end

    def invitation_view
    end

    def manage_view
      @user = @session.group.users.find_by(uuid: params[:user_uuid])
      @membership = @session.group.memberships.find_by(user_uuid: params[:user_uuid])
    end

    def index_api
      page = params[:page]&.to_i || 1
      per_page = params[:per_page]&.to_i || 15
      sort_field = params[:sort_field] || 'username'
      sort_order = params[:sort_order] || 'ASC'

      users = @session.group.users.left_joins(:user_emails)
      users = users.where('lower(name) LIKE ? OR lower(surname) LIKE ?', "%#{params[:s].downcase}%", "%#{params[:s].downcase}%") unless params[:s].blank?
      
      users = users.order('username': sort_order) if sort_field == 'username'
      users = users.order('name': sort_order) if sort_field == 'name'
      users = users.order('surname': sort_order) if sort_field == 'surname'
      users = users.order('matilda_core_user_emails.email': sort_order) if sort_field == 'email'
      
      users = users.page(page).per(per_page)

      render_json_success(
        users: users.map(&:as_json_with_email),
        pagination: pagination_data(users)
      )
    end

    def manage_api
      user_uuid = params[:user_uuid]

      user = @session.group.users.find_by(uuid: user_uuid)
      unless user
        json_errors(json_error(I18n.t('matilda_core.messages.user_not_valid'), code: :user_uuid))
        render_json_fail
        return
      end

      render_json_success(
        user: user.as_json_with_email,
        user_emails: user.user_emails
      )
    end

    def invitation_action
      command = command_manager(generate_invitation_command)
      return unless command

      render_json_success({})
    end

    def edit_permissions_action
      command = command_manager(generate_edit_permissions_command)
      return unless command

      session_update_group(@session.group_uuid) # aggiorno la sessione per aggiornare i permessi dell'utente
      render_json_success({})
    end

    def edit_permissions_role_action
      command = command_manager(generate_edit_permissions_role_command)
      return unless command

      session_update_group(@session.group_uuid) # aggiorno la sessione per aggiornare i permessi dell'utente
      render_json_success({})
    end

    def remove_action
      command = command_manager(generate_remove_command)
      return unless command

      render_json_success({})
    end

    private

    def generate_invitation_command
      command_params = params.permit(:name, :surname, :email)
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      MatildaCore::Memberships::InviteMemberCommand.new(command_params)
    end

    def generate_edit_permissions_command
      command_params = params.permit(:user_uuid, permissions: [])
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      command_params[:permissions] = command_params[:permissions] || []
      MatildaCore::Memberships::EditMemberPermissionsCommand.new(command_params)
    end

    def generate_edit_permissions_role_command
      command_params = params.permit(:user_uuid, :role)
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      command_params[:permissions] = command_params[:permissions] || []
      MatildaCore::Memberships::EditMemberPermissionsRoleCommand.new(command_params)
    end

    def generate_remove_command
      command_params = params.permit(:user_uuid)
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      MatildaCore::Memberships::RemoveMemberCommand.new(command_params)
    end

  end

end
