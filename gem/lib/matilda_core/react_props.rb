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
        @router_routes[route.name] = route.path.spec.to_s
      end

      # add routes from engines
      # TODO
      Rails::Engine.subclasses.map(&:instance).each do |instance|
         
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
