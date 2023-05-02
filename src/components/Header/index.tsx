import React, { ReactElement, useReducer, useState } from "react"
type headerProps = {
  children: ReactElement
}
const Header = ({ children }: headerProps) => {
  const [navState, switchNavState] = useReducer((state)=>!state, false)
  const methods = {
    navHandler(event: React.MouseEvent<HTMLElement>) {
      event.preventDefault()
      switchNavState()
    }
  }
  const computed = {
    headerClassName(): string {
      const classNameList = []
      navState && classNameList.push('nav-open')
      return classNameList.join(' ')
    }
  }
  console.log('header')
  return (
    <div id="header" className={computed.headerClassName()}>
      <div className="hgroup">
        <h1 className="logo"><strong>C<span>aption</span></strong> S<span>tudio</span></h1>
        <a href="#" id="nav-trigger" onClick={event=>methods.navHandler(event)}><span>menu</span></a>
        {React.cloneElement(children, {})}
      </div>
    </div>
  )
}
export default Header