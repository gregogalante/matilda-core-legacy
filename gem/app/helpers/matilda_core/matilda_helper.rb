# frozen_string_literal: true

module MatildaCore

  # MatildaHelper.
  module MatildaHelper

    def matilda_react_view(module_name, props = {})
      react_component "#{module_name}/views/#{controller_name}/#{action_name}/index", {
        matilda: @session&.react_props || MatildaCore::Session.react_props
      }.merge(props)
    end

  end

end
