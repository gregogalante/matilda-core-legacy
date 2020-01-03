# frozen_string_literal: true

namespace :matilda_core do
  namespace :install do
    desc "Installa le dipendenze front-end dall'engine all'applicazione principale"
    task :front, :environment do |_task, args|
      src = "#{MatildaCore::Engine.root}/front"
      dst = "#{Rails.root}/vendor/matilda_core"
      FileUtils.copy_entry(src, dst)
    end
  end
end
