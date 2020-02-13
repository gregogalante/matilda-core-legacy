# frozen_string_literal: true

module MatildaCore

  # Engine.
  class Engine < ::Rails::Engine

    isolate_namespace MatildaCore

    # Imposto le voci della sidebar utilizzando la configurazione dell'engine.
    initializer 'matilda_core.add_sidebar_items', after: :add_routing_paths do |_app|
      MatildaCore.config.global_logo = 'http://iot.blupura.com/assets/lato/logo-46b603a0aa82e3d1c298e65c824f313940e7a7df9e4a5ecd9158d1292e490466.png'

      Rails.application.reload_routes!

      MatildaCore.config.add_sidebar_item(
        'matilda_core.groups',
        label: 'locale.matilda_core.titles.dashboard',
        url: MatildaCore::Engine.routes.url_helpers.groups_index_view_path,
        icon: 'fas fa-tachometer-alt',
        index: 1000
      )
      MatildaCore.config.add_sidebar_item(
        'matilda_core.memberships',
        label: 'locale.matilda_core.titles.users',
        url: MatildaCore::Engine.routes.url_helpers.app_memberships_index_view_path,
        icon: 'fas fa-users',
        permission: 'matilda_core.memberships',
        index: 1100
      )
    end

    # Imposto i permessi degli utenti.
    initializer 'matilda_core.add_memberships_permissions' do |_app|
      MatildaCore.config.add_memberships_permission(
        'matilda_core.memberships',
        label: 'locale.matilda_core.strings.manage_users_permission',
        index: 0,
        group: 'locale.matilda_core.titles.users'
      )
    end

  end

end
