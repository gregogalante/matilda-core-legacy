# frozen_string_literal: true

module MatildaCore

  # AuthenticationController.
  class AuthenticationController < MatildaCore::ApplicationController

    layout 'matilda_core/authentication'

    # View
    #######################################################

    def login_view
      redirect_to matilda_core.root_path if session_present?
    end

    def signup_view
      redirect_to matilda_core.root_path if session_present?
      redirect_to matilda_core.authentication_login_view_path unless MatildaCore.config.authentication_permit_signup
    end

    def recover_password_view; end

    def recover_password_complete_view; end

    def update_password_view
      @user_uuid = params[:user_uuid] || session[:mat_core_authentication_user_uuid]
    end

    def update_password_complete_view; end

    # Actions
    #######################################################

    def login_action
      command = command_manager(generate_login_command)
      return unless command

      render_json_success(token: generate_token(command.session_uuid, command.user_uuid))
    end

    def signup_action
      command = command_manager(generate_signup_command)
      return unless command

      render_json_success(token: generate_token(command.session_uuid, command.user_uuid))
    end

    def recover_password_action
      command = command_manager(generate_recover_password_command)
      return unless command

      session[:mat_core_authentication_user_uuid] = command.user_uuid
      render_json_success(user_uuid: command.user_uuid)
    end

    def update_password_action
      command = command_manager(generate_update_password_command)
      return unless command

      render_json_success({})
    end

    def logout_action
      session_set

      command = command_manager(generate_logout_command)
      return unless command

      session_destroy
      render_json_success({})
    end

    private

    def generate_token(session_uuid, user_uuid)
      token = session_create(session_uuid, user_uuid)

      # se e' stato impostato un gruppo di default lo agiungo gia nel token (quindi eseguo l'auto selezione del gruppo di default)
      if MatildaCore.config.global_default_group_uuid && MatildaCore::Group.find_by(uuid: MatildaCore.config.global_default_group_uuid)
        token = session_update_group(MatildaCore.config.global_default_group_uuid)
      end

      token
    end

    def generate_login_command
      command_params = params.permit(:username_email, :password)
      command_params[:ip_address] = request.remote_ip
      MatildaCore::Authentication::LoginCommand.new(command_params)
    end

    def generate_signup_command
      command_params = params.permit(:name, :surname, :email, :username, :password, :password_confirmation)
      command_params[:ip_address] = request.remote_ip
      MatildaCore::Authentication::SignupCommand.new(command_params)
    end

    def generate_recover_password_command
      command_params = params.permit(:username_email)
      MatildaCore::Authentication::RecoverPasswordCommand.new(command_params)
    end

    def generate_update_password_command
      command_params = params.permit(:user_uuid, :recover_password_code, :password, :password_confirmation)
      MatildaCore::Authentication::UpdatePasswordCommand.new(command_params)
    end

    def generate_logout_command
      command_params = { session_uuid: @session&.user_session_uuid }
      MatildaCore::Authentication::LogoutCommand.new(command_params)
    end

  end

end
