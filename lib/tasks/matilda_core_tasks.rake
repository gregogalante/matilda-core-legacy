# frozen_string_literal: true

require 'csv'
require 'rest-client'

namespace :matilda_core do

  #################################################################################

  namespace :install do

    # *****************************************************************************

    desc "Installa le dipendenze front-end dall'engine all'applicazione principale"
    task front: :environment do |_task, args|
      # TODO: inserire avviso nel caso non sia installata la gemma react-rails

      # copy front module to main application
      src = "#{MatildaCore::Engine.root}/front"
      dst = "#{Rails.root}/vendor/matilda_core"
      FileUtils.rm_rf(dst) if File.exist?(dst)
      FileUtils.copy_entry(src, dst)

      # install dependencies inside main applicaiton
      # dependencies = JSON.parse(File.read("#{dst}/dependencies.json"))
      # system("yarn add #{dependencies['dependencies'].join(' ')}")

      # create matilda.js file in packs if not exists
      pack_dst = "#{Rails.root}/app/javascript/packs/matilda.js"
      if File.exist?(pack_dst)
        puts "IMPORTANTE: Controllare gli import del file #{pack_dst} o eliminare il file e rieseguire il task."
      else
        File.open(pack_dst, "w+") { |f| f.write("// Support component names relative to this directory:\nvar matildaCoreRequireContext = require.context('../../../vendor/matilda_core', true);\nvar ReactRailsUJS = require('react_ujs');\nReactRailsUJS.useContext(matildaCoreRequireContext);") }
      end

      puts "IMPORTANTE: Aggiungere 'vendor/matilda_core' tra le additional_paths nel file di configurazione webpacker.yml"
    end

    # *****************************************************************************

    desc "Installa le traduzioni dell'applicativo a partire da una sorgente impostato in configurazione"
    task :locales, :environment do |_task, args|
      # eseguo import initializer Matilda per caricamento configurazione applicazione
      config_path = "#{Rails.root}/config/initializers/matilda_core.rb"
      require config_path if File.exist?(config_path)

      locales_source_type = MatildaCore.config.locales_source_type
      locales_source_value = MatildaCore.config.locales_source_value
      if locales_source_value && locales_source_type
        csv_file_path = nil
        csv_file_path_to_delete = false

        # ottengo la path del csv con le lingue
        if locales_source_type == :gdrive_spreadsheet_key
          csv_file_path_to_delete = true
          download_url = "https://docs.google.com/spreadsheets/d/#{locales_source_value}/export?format=csv"
          download_path = "#{Rails.root}/tmp/matilda_core_temporary_locales.csv"
          download_response = RestClient.get(download_url)
          File.write(download_path, download_response.body.force_encoding("UTF-8"))
          csv_file_path = download_path
        elsif locales_source_type == :csv_file_path
          csv_file_path = locales_source_value
        end

        # esporto le lingue nei corrispondenti file di traduzione di rails
        if csv_file_path
          yaml_data_per_lang = {}

          csv_text = File.read(csv_file_path)
          csv = CSV.parse(csv_text, headers: true)
          csv.each do |row|
            row_hash = row.to_hash
            languages = row_hash.keys.reject { |k| ['SISTEMA', 'GRUPPO', 'CHIAVE'].include?(k) }

            languages.each do |language|
              yaml_data_per_lang[language] = {} unless yaml_data_per_lang[language]
              yaml_data_per_lang[language][row_hash['SISTEMA']] = {} unless yaml_data_per_lang[language][row_hash['SISTEMA']]
              yaml_data_per_lang[language][row_hash['SISTEMA']][row_hash['GRUPPO']] = {} unless yaml_data_per_lang[language][row_hash['SISTEMA']][row_hash['GRUPPO']]
              yaml_data_per_lang[language][row_hash['SISTEMA']][row_hash['GRUPPO']][row_hash['CHIAVE']] = row_hash[language]
            end
          end

          yaml_data_per_lang.each do |lang, data|
            yaml_obj = {}
            yaml_obj[lang.downcase] = data
            File.write("#{Rails.root}/config/locales/#{lang.downcase}.yml", yaml_obj.to_yaml)
          end

          File.delete(csv_file_path) if File.exist?(csv_file_path) && csv_file_path_to_delete
        end
      end
    end

    # *****************************************************************************

  end

  #################################################################################

  namespace :generator do

    # *****************************************************************************

    desc "Genera un gruppo sul database"
    task group: :environment do |_task, args|
      group_name = ENV['name']
      group_uuid = ENV['uuid'] || SecureRandom.uuid
      throw 'Nome non inserito' if group_name.blank? 
      
      group = MatildaCore::Group.find_or_create_by(uuid: group_uuid)
      group&.update(name: group_name)
      puts "Gruppo creato correttamente con uuid #{group.uuid}"
    end

    # *****************************************************************************

    desc "Genera un utente sul database"
    task user: :environment do |_task, args|
      group_uuid = ENV['group_uuid']
      username = ENV['username']
      email = ENV['email']
      password = ENV['password'] || 'ChangeMe1!'
      throw 'Gruppo non specificato' if group_uuid.blank? 
      throw 'Username non inserito' if username.blank? 
      throw 'Email non inserita' if email.blank?
      
      user = MatildaCore::User.find_by(username: username) || MatildaCore::User.create(uuid: SecureRandom.uuid, username: username, name: 'Temp', surname: 'Temp')
      user&.update(password: BCrypt::Password.create(password))
      user_email = MatildaCore::UserEmail.find_or_create_by(user_uuid: user.uuid, email: email)
      membership = MatildaCore::Membership.find_or_create_by(user_uuid: user.uuid, group_uuid: group_uuid, permissions: MatildaCore.config.memberships_permissions.map { |p| p[:name] })
      puts "Utente creato correttamente con username #{username} e password #{password}"
    end

    # *****************************************************************************

  end

  #################################################################################

end
