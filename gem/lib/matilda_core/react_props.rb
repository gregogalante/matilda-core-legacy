# frozen_string_literal: true

module MatildaCore

  # ReactProps.
  class ReactProps

    def initialize
      initialize_data
    end

    def reset
      initialize_data
    end

    def to_hash
      {
        i18n: {
          available_locales: I18n.available_locales,
          locale: I18n.locale,
          translations: i18n_translations(I18n.locale)
        },
        router: {
          routes: router_routes
        }
      }
    end

    # Funzioni principali di gestione dei dati
    ######################################################################

    def initialize_data
      @i18n_translations = {}
      @router_routes = nil
    end

    def i18n_translations(locale)
      invalid_first_level_keys = ['activerecord', 'date', 'datetime', 'errors', 'helpers', 'number', 'support', 'time', 'views']
      @i18n_translations[locale] ||= flatten_hash(I18n.backend.send(:translations)[locale]).select { |k, v| invalid_first_level_keys.select { |s| k.start_with?("#{s}.") }.length.zero? }
      @i18n_translations[locale]
    end

    def router_routes
      return @router_routes if @router_routes

      @router_routes ||= {}

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
              @router_routes["#{subclass_name}.#{subclass_route_name}"] = { path: "#{route_path}#{subclass_route_path}", method: subclass_route_method }
            end
          end
        end

        @router_routes[route_name] = { path: route_path, method: route_method } unless has_gem
      end

      @router_routes
    end

    private

    def flatten_hash(param, prefix=nil)
      param.each_pair.reduce({}) do |a, (k, v)|
        v.is_a?(Hash) ? a.merge(flatten_hash(v, "#{prefix}#{k}.")) : a.merge("#{prefix}#{k}".to_sym => v)
      end
    end

  end

end
