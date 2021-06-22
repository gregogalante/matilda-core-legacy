# frozen_string_literal: true

module MatildaCore

  # Session.
  class Session

    attr_accessor :data

    def initialize(data = nil)
      return set(data) if data
      @data = initialize_data
    end

    def to_string
      @data.to_json
    end

    def to_hash
      @data
    end

    def reset
      @data = initialize_data
    end

    def set(data = nil)
      return unless data

      data_parsed = JSON.parse(data).with_indifferent_access
      @data = validate_data(data_parsed)
    end

    # Funzioni principali di gestione dei dati
    ######################################################################

    # Locale

    def locale(locale = nil)
      @data[:locale] = locale if locale

      @data[:locale]
    end

    # User session

    def user_session_uuid(user_session_uuid = nil)
      @data[:user_session_uuid] = user_session_uuid if user_session_uuid

      @data[:user_session_uuid]
    end

    # User

    def user_uuid(user_uuid = nil)
      if user_uuid && user = MatildaCore::User.find_by(uuid: user_uuid)
        @data[:user_uuid] = user_uuid
        @data[:user_complete_name] = user.complete_name
        @data[:user_email] = user.email
      end

      @data[:user_uuid]
    end

    def user_complete_name
      @data[:user_complete_name]
    end

    def user
      @user ||= MatildaCore::User.find_by(uuid: @data[:user_uuid])
    end

    # Group

    def group_uuid(group_uuid = nil)
      if group_uuid && group = MatildaCore::Group.find_by(uuid: group_uuid)
        @data[:group_uuid] = group_uuid
        @data[:group_name] = group.name
        @data[:group_permissions] = membership.permissions
      end

      @data[:group_uuid]
    end

    def group_reset
      @data[:group_uuid] = nil
      @data[:group_name] = nil
      @data[:group_permissions] = []
    end

    def group
      @group ||= MatildaCore::Group.find_by(uuid: @data[:group_uuid])
    end

    def group_permissions
      @data[:group_permissions] || []
    end

    def group_name
      @data[:group_name]
    end

    # Membership

    def membership
      @membership ||= MatildaCore::Membership.find_by(group_uuid: group_uuid, user_uuid: user_uuid)
    end

    # React props

    def react_props
      MatildaCore::Session.react_props.merge(session: @data)
    end

    # Funzioni per la generazione delle props react
    ######################################################################

    def self.react_props
      {
        i18n: {
          available_locales: I18n.available_locales,
          locale: I18n.locale,
          translations: react_props_i18n_translations(I18n.locale)
        },
        router: {
          routes: react_props_router_routes
        }
      }
    end

    def self.react_props_i18n_translations(locale)
      Rails.cache.fetch("MatildaCore::Session.react_props_i18n_translations(#{locale})") do
        invalid_first_level_keys = ['activerecord', 'date', 'datetime', 'errors', 'helpers', 'number', 'support', 'time', 'views']
        react_props_i18n_translations_flatten_hash(I18n.backend.send(:translations)[locale]).select { |k, v| invalid_first_level_keys.select { |s| k.start_with?("#{s}.") }.length.zero? }
      end
    end
    def self.react_props_i18n_translations_flatten_hash(param, prefix=nil)
      param.each_pair.reduce({}) do |a, (k, v)|
        v.is_a?(Hash) ? a.merge(react_props_i18n_translations_flatten_hash(v, "#{prefix}#{k}.")) : a.merge("#{prefix}#{k}".to_sym => v)
      end
    end

    def self.react_props_router_routes
      Rails.cache.fetch("MatildaCore::Session.react_props_router_routes") do
        router_routes = {}

        # add routes from main application
        Rails.application.routes.routes.each do |route|
          has_gem = false
          route_name = route.name
          route_path = route.path.spec.to_s.gsub('(.:format)', '')
          route_method = route.verb.upcase

          Rails::Engine.subclasses.each do |subclass|
            subclass_name = subclass.module_parent.name.underscore
          
            if route_name == subclass_name
              has_gem = true
              subclass.instance.routes.routes.each do |subclass_route|
                subclass_route_name = subclass_route.name
                subclass_route_path = subclass_route.path.spec.to_s.gsub('(.:format)', '')
                subclass_route_method = subclass_route.verb.upcase
                router_routes["#{subclass_name}.#{subclass_route_name}"] = { path: "#{route_path}#{subclass_route_path}", method: subclass_route_method }
              end
            end
          end

          router_routes[route_name] = { path: route_path, method: route_method } unless has_gem
        end

        router_routes
      end
    end

    ######################################################################

    protected

    def initialize_data
      {}
    end

    def validate_data(data)
      raise 'Data not valid' unless data&.is_a?(Hash)

      data
    end

  end

end
