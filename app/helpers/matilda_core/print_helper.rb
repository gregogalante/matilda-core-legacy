# frozen_string_literal: true

module MatildaCore

  # PrintHelper.
  module PrintHelper

    def print_date(date, format = MatildaCore.config.global_date_format)
      return unless date

      date.strftime(format)
    end

    def print_sidebar_item_label(item)
      return item[:label] unless item[:label].include?('locale.')
      I18n.t("matilda_core.sidebar.#{item[:label].split('locale.').last}", default: item[:label])
    end

  end

end
