import React from 'react'
import styles from './style.css'

const contacts = [
  {
    question: 'Product, desktop clients questions',
    users: [
      {
        name: 'Ihar Shulhan',
        email: 'i.shulgan@innopolis.ru',
        telegram: 'ihar_shulhan'
      }
    ]
  },
  {
    question: 'Website questions',
    users: [
      {
        name: 'Daria Larionova',
        email: 'd.larionova@innopolis.ru',
        telegram: 'DaryaLari'
      }
    ]
  }
]

class Footer extends React.Component {
  render() {
    return (
        <footer className={styles.footer}>
          <h4>Contact us</h4>
          <div className={styles.questions}>
            {contacts.map(contact =>  (
                <div className={styles.question} key={contact.question}>
                  <h5>{contact.question}:</h5>
                  {contact.users.map(user => (
                    <div className={styles.user} key={user.email}>
                      <span className={styles.name}>
                        {user.name}
                      </span>
                      <span className={styles.userContact}>
                        <i className='material-icons'>email</i>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </span>
                      <span className={styles.userContact}>
                        <i className='material-icons'>near_me</i>
                        <a href={`https://t.me/${user.telegram}`}>@{user.telegram}</a>
                      </span>
                    </div>
                  ))}

                </div>
            ))}
          </div>
        </footer>

    )
  }
}

export default Footer