import React from 'react'
import { Loader } from '@mantine/core'

function Loading() {
  return (
    <div style={{width: '100%', height:"100%", display: 'grid', placeContent:'center'}}>
        <Loader color="red" variant="dots" />
    </div>
  )
}

export default Loading