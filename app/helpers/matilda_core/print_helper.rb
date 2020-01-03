# frozen_string_literal: true

module MatildaCore

  # PrintHelper.
  module PrintHelper

    def print_date(date, format = MatildaCore.config.global_date_format)
      return unless date

      date.strftime(format)
    end

  end

end
