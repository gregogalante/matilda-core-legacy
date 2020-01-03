# frozen_string_literal: true

module MatildaCore

  # ApplicationMailer.
  class ApplicationMailer < ActionMailer::Base

    layout 'matilda_core/mailer'
    default from: 'Matilda <matilda@1d3o.it>'
    default template_path: 'matilda_core/mailers'

  end

end
