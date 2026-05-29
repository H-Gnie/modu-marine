import React from 'react'

export default function Toast({ msg, visible }) {
  return (
    <div id="toast" className={`toast${visible ? ' show' : ''}`} role="status">
      {msg}
    </div>
  )
}
