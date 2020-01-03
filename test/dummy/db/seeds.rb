# frozen_string_literal: true

# command_create_group = MatildaCore::Groups::CreateGroupCommand.new(
#   name: 'Matilda development group'
# )
# throw command_create_group.error_messages.to_sentence unless command_create_group.completed?

# command_invite_member = MatildaCore::AppMemberships::InviteMemberCommand.new(
#   group_uuid: command_create_group.group_uuid,
#   name: 'Sviluppatore',
#   surname: '1d3o',
#   email: 'me@gregoriogalante.com'
# )
# throw command_invite_member.error_messages.to_sentence unless command_invite_member.completed?

MatildaCore::Group.create(
  uuid: 'default',
  name: 'Gruppo di sviluppo'
)
