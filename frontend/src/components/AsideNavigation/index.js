import React from 'react'
import { Link } from 'react-router-dom'
import styles from './style.css'

class AsideNavigation extends React.Component {
  state = {
    opened: true
  }
  onOpenClose = () => {
    this.setState({opened : !this.state.opened})
  }
  projectsNavigation = [
    {
      icon: 'developer_board',//'dashboard',
      name: 'Dashboard',
      link: this.props.match.url
    },
    {
      icon: 'dvr',//'storage',
      name: 'Activities',
      link: this.props.match.url + '/activities'
    },
    {
      icon: 'people',
      name: 'Team members',
      link: this.props.match.url + '/team'
    },
    {
      icon: 'track_changes', // 'list_alt'
      name: 'Manage goals',
      link: this.props.match.url + '/goals'
    },
    {
      icon: 'settings',
      name: 'Settings',
      link: this.props.match.url + '/settings'
    }
  ]

  personalNavigation = [
    {
      icon: 'developer_board',//'dashboard',
      name: 'Dashboard',
      link: '/dashboard'
    },
    {
      icon: 'dvr',//'storage',
      name: 'Activities',
      link: '/activities'
    },
    // {
    //   icon: 'people',
    //   name: 'Projects',
    //   link: this.props.match.url + '/projects'
    // },
    // {
    //   icon: 'track_changes', // 'list_alt'
    //   name: 'Manage goals',
    //   link: '/goals'
    // },
    // {
    //   icon: 'settings',
    //   name: 'Settings',
    //   link: '/settings'
    // }
  ]
  render() {
    const navigation = this.props.match.path === '/projects/:projectName' ?
                       this.projectsNavigation : this.personalNavigation
    return (
      <aside className={this.state.opened ? styles.asideOpened : styles.asideClosed}>
        <div className={styles.navContainer}>
          <nav className={styles.nav}>
            {navigation.map(i => (
              <Link className={styles.navItem}
                   key={i.link}
                   to={i.link}
              >
                <i className={`${'material-icons'}`}>
                  {i.icon}
                </i>
                {this.state.opened && (
                  <span>{i.name}</span>
                 )}
              </Link>
            ))}
          </nav>
        </div>
        {this.state.opened ? (
          <div className={styles.openCloseBtn} onClick={this.onOpenClose}>
            <i className={`${'material-icons'}`}>
              chevron_left
            </i>
            <span>Collapse</span>
          </div>) : (
          <div className={styles.openCloseBtn} onClick={this.onOpenClose}>
            <i className={`${'material-icons'}`}>
              chevron_right
            </i>
            {this.state.opened && (
              <span>Expand</span>
            )}
          </div>
        )}
      </aside>

    )
  }
}

export default AsideNavigation