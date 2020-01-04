# frozen_string_literal: true

module MatildaCore

  # Config.
  class Config

    # GLOBAL

    # Imposta il titolo generico del prodotto.
    attr_accessor :global_title

    # Imposta il formato utilizzato per la visualizzazione delle date.
    attr_accessor :global_date_format

    # Imposta un gruppo utilizzabile di default. Se viene impostato
    # l'intera piattaforma lavorera' in automatico con il gruppo specificato
    # e non sara' possibile lavorare con qualsiasi altro gruppo.
    attr_accessor :global_default_group_uuid

    # Imposta i permessi da applicare di default ai nuovi utenti dei gruppi.
    attr_accessor :global_default_group_permissions

    # AUTHENTICATION

    # Imposta la possibilita' di registrarsi autonomamente alla piattaforma.
    attr_accessor :authentication_permit_signup

    # MEMBERSHIPS

    # Specifica la lista di permessi utilizzabili dall'applicazione.
    attr_accessor :memberships_permissions

    # GRUPPI

    # Specifica se permettere agli utenti di creare nuovi gruppi o meno.
    attr_accessor :groups_permit_creation_to_users

    # Specifica il numero massimo di gruppi ai quali l'utente puo' appartenere.
    # Se il limite e' impostato a 1 allora la sezione di selezione gruppo viene nascosta.
    attr_accessor :groups_max_number_per_user

    # SIDEBAR

    # Contiene la lista di voci della sidebar.
    attr_accessor :sidebar_items

    def initialize
      set_default_options
    end

    def set_default_options
      @global_title = 'Matilda'
      @global_date_format = '%d-%m-%Y'
      @global_default_group_uuid = nil
      @global_default_group_permissions = []
      @authentication_permit_signup = true
      @groups_permit_creation_to_users = true
      @groups_max_number_per_user = nil
      @sidebar_items = []
      @memberships_permissions = []
    end

    # Permette di aggiungere una nuova voce di menu alla sidebar.
    def add_sidebar_item(name, label: '', url: '', icon: '', permission: nil, index: 0)
      names = @sidebar_items.map { |i| i[:name] }
      throw 'Name already used' if names.include?(name)

      @sidebar_items.push(
        name: name,
        label: label,
        url: url,
        icon: icon,
        permission: permission,
        index: index
      )
      @sidebar_items = @sidebar_items.sort_by { |hsh| hsh[:index] }
    end

    # Permette di aggiungere un nuovo possibile livello di permesso alla applicazione.
    def add_memberships_permission(name, label: '', group: 'Generali', index: 0)
      names = @memberships_permissions.map { |i| i[:name] }
      throw 'Name already used' if names.include?(name)

      @memberships_permissions.push(
        name: name,
        label: label,
        group: group,
        index: index
      )
    end

  end

end
