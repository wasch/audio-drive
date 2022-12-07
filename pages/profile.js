import ProfileInfo from '../components/ProfileInfo'
import Layout from '../components/Layout'

export default function Profile() {
  
  return (
    <div>
      <ProfileInfo />
    </div>
  )
}

Profile.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}