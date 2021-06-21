# frozen_string_literal: true

module MatildaCore

  # MatildaHelper.
  module MatildaHelper

    def matilda_react_view(module_name, props = {})
      react_component "#{module_name}/views/#{controller_name}/#{action_name}/index", {
        matilda: matilda_react_view_props
      }.merge(props)
    end

    def matilda_react_view_props
      MatildaCore.config.react_props.to_hash
    end

  end

end
