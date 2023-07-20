import React from 'react'

const InstaShareContext = React.createContext({
  /* search panel */
  onDisplaySearchPanel: () => {},
  searchPanel: false,
  /* Show Nav Items */
  onClickMenuButton: () => {},
  onDisplayMenu: false,
  onCloseMenuNavItems: () => {},
})

export default InstaShareContext
