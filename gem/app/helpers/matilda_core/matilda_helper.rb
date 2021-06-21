# frozen_string_literal: true

module MatildaCore

  # MatildaHelper.
  module MatildaHelper

    def matilda_react_view(module_name, props = {})
      react_component "#{module_name}/views/#{controller_name}/#{action_name}/index", {
        matilda: MatildaCore.config.react_props.to_hash
      }.merge(props)
    end

  end

end
