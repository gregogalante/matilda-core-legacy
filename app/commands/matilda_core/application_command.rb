# frozen_string_literal: true

module MatildaCore

  # ApplicationCommand.
  class ApplicationCommand < Evnt::Command

    default_options exceptions: false,
                    nullify_empty_params: false

    protected

    def internal_error
      err('Si è verificato un errore interno', code: :error_500)
    end

  end

end
