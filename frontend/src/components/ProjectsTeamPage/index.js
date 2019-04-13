import React from 'react'
import {connect} from 'react-redux'
import { Field, isInvalid, reduxForm } from 'redux-form'
import { inviteUserRequest } from '../../store/projects/actionCreators'
import Button from '../Button'
import Input from '../Input'
import PageTemplate from '../PageTemplate'
import styles from './style.css'

class _ProjectsTeamPage extends React.Component {
  onSubmit = () => {
    console.log('invite new developer to ' + this.props.match.params.projectName)
    this.props.inviteUser(this.props.match.params.projectName)
  }
  render() {
    // const projectName = this.props.match.params.projectName
    return (
      <PageTemplate title={`Project '${this.props.match.params.projectName}' team`}
      >
        <form className={styles.inviteForm}
              onSubmit={this.props.handleSubmit(this.onSubmit)}
        >
          <h2>
            Invite new team member by email
          </h2>
          <Field
            name='email'
            component={Input}
            placeholder='Email'
            type='email'
            // validate={[required, email]}
            disabled={this.props.activeRequest}
          />
          <Button
            name='Invite'
            styleType='primary'
          />
        </form>
      </PageTemplate>

    )
  }
}

let ProjectsTeamPage = reduxForm({
  form: 'projectInvitation',
})(_ProjectsTeamPage)

ProjectsTeamPage = connect(
  (state) => ({
    authFormState: state.form.projectInvitation,
    submitDisabled: isInvalid('projectInvitation')(state)
  }),

  (dispatch) => ({
    inviteUser: (project) => dispatch(inviteUserRequest(project))
  })
)(ProjectsTeamPage)

export default ProjectsTeamPage