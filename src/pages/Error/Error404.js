import PageWrapper from "../../components/shared/Layout/PageWrapper/PageWrapper"
import NoteBox from "../../components/shared/NoteBox/NoteBox"

const Error404 = () => (
  <PageWrapper title="Greška 404" back={true}>
    <NoteBox>
      <center>Nažalost, tražena strana nije mogla biti pronađena.</center>
    </NoteBox>
  </PageWrapper>
)

export default Error404
