# frozen_string_literal: true

module MatildaCore

  # AuthenticationMailer.
  class AuthenticationMailer < MatildaCore::ApplicationMailer

    default template_path: 'matilda_core/mailers/authentication'

    def recover_password(user_uuid)
      @user = MatildaCore::User.find_by(uuid: user_uuid)
      return unless @user

      mail(to: @user.email, subject: "Recurero password - #{MatildaCore.config.global_title}")
    end

    def validate_email(user_uuid, email)
      @email = email
      @user = MatildaCore::User.find_by(uuid: user_uuid)
      return unless @user

      mail(to: @email, subject: "Conferma indirizzo email - #{MatildaCore.config.global_title}")
    end

  end

end
