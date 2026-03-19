import React from 'react'

export const Input = ({ type = "text", placeholder = "", className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={className}
    />
  )
}
