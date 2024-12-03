// import style from './Card.module.scss';
import Card from '@mui/material/Card';

const CardComponent = ({ children, styleCard, className }) => {
  return (
    <Card sx={styleCard} className={className}>
      {children}
    </Card>
  )
}

export default CardComponent