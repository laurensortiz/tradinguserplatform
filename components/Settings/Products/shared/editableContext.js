import React from 'react'

const EditableContext = React.createContext({})

export const EditableProvider = EditableContext.Provider;
export const EditableConsumer = EditableContext.Consumer;
export default EditableContext