// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This is simply the hamburger navigation menu
import React from 'react'
import { Menu, MenuItem, IconButton } from '@looker/components'
import { Menu as MenuIcon} from '@styled-icons/material/Menu'
import { NavLink } from 'react-router-dom';

export const NavigationMenu = ({menuToggle, routes}) => {
    return (
      <>
        <div className={menuToggle?"navigation open":"navigation collapse"}>
          {routes.examples.length > 0 &&
            <ul className='nav-list'>
              {routes.examples.map(r => {
                return(
                  <li key={r.text}>
                    <NavLink activeclassname='active' to={r.url}>
                      <div  className='nav-item'>                        
                        {r.text}
                      </div>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          }
        </div>
      </>
    )
}