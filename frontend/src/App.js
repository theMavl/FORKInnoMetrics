import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AsideNavigation from './components/AsideNavigation'
import Spinner from './components/Spinner'
const AuthorizationPage  = lazy(() => import('./components/AuthorizationPage'))
const ActivitiesPage  = lazy(() => import('./components/ActivitiesPage'))
const LandingPage = lazy(() => import('./components/LandingPage'))
const AuthorizedRoute  = lazy(() => import('./components/AuthorizedRoute'))
const ProjectsListPage  = lazy(() => import('./components/ProjectsListPage'))
const StatisticsPage  = lazy(() => import('./components/StatisticsPage'))
const ProjectsTeamPage  = lazy(() => import('./components/ProjectsTeamPage'))
import styles from './style.css'

class App extends React.Component {
  render() {
      return (
        <React.Fragment>
          <Header/>
          <main>
            <Route path='/(dashboard|activities|goals|settings)' component={AsideNavigation}/>
            {/*<Route path='/projects/:projectName' component={AsideNavigation}/>*/}
            <Suspense fallback={<Spinner/>}>
              <Switch>
                <Route exact path='/' component={LandingPage}/>
                <Route path='/login' component={AuthorizationPage}/>
                <Route path='/register' component={AuthorizationPage}/>
                <AuthorizedRoute path='/dashboard' component={StatisticsPage}/>
                <AuthorizedRoute path='/activities' component={ActivitiesPage}/>
                {/*<AuthorizedRoute exact path='/projects' component={ProjectsListPage}/>*/}
                {/*<AuthorizedRoute exact path='/projects/:projectName' component={StatisticsPage}/>*/}
                {/*<AuthorizedRoute path='/projects/:projectName/activities' component={ActivitiesPage}/>*/}
                {/*<AuthorizedRoute path='/projects/:projectName/team' component={ProjectsTeamPage}/>*/}
                <Redirect to='/dashboard'/>
              </Switch>
            </Suspense>
          </main>
          <Footer/>
        </React.Fragment>
      )
  }
}



export default App