import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from 'carbon-components-react';

export const CPVHeader = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="COVID Pass Verifier">
        <SkipToContent />
        {/*<HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />*/}
        <HeaderName href="/" prefix="">
          COVID Pass Verifier
        </HeaderName>
        {/*<HeaderNavigation aria-label="COVID Pass Verifier">
          <HeaderMenuItem href="/repos">How it works</HeaderMenuItem>
         </HeaderNavigation>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}>
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem href="/repos">Repositories</HeaderMenuItem>
            </HeaderSideNavItems>
          </SideNavItems>
    </SideNav>*/}
        <HeaderGlobalBar />
      </Header>
    )}
  />
);
