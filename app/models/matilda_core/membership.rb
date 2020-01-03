# frozen_string_literal: true

module MatildaCore

  # Membership.
  class Membership < ApplicationRecord

    belongs_to :user, foreign_key: :user_uuid, optional: true
    belongs_to :group, foreign_key: :group_uuid, optional: true

    serialize :permissions, Array

  end

end
