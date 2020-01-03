# frozen_string_literal: true

module MatildaCore

  # GroupsController.
  class GroupsController < MatildaCore::ApplicationController

    before_action :session_present_check

    def index_view
      @groups = @session.user.groups.order('name ASC')
      session_update_group(nil)
      sidebar_set('matilda_core.groups')
    end

    def dash_view
      @group = @session.group || @session.user.groups.find_by(uuid: params[:group_uuid])

      unless @group
        redirect_to matilda_core.groups_index_view_path
        return
      end

      session_update_group(@group.uuid)
      sidebar_set('matilda_core.groups')
    end

    def select_action
      @group = @session.user.groups.find_by(uuid: params[:group_uuid])

      unless @group
        render_json_fail
        return
      end

      render_json_success(token: session_update_group(@group.uuid))
    end

    def create_action
      command = command_manager(generate_create_command)
      return unless command

      render_json_success({})
    end

    private

    def generate_create_command
      command_params = params.permit(:name)
      command_params[:user_uuid] = @session.user_uuid
      command_params[:log_who] = @session.user_uuid
      MatildaCore::Groups::CreateGroupCommand.new(command_params)
    end

  end

end
