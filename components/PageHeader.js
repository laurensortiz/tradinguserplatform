import { PageHeader } from 'antd';
import Router from 'next/router'



const Title = ({title, subTitle = ''}) => {
  return <PageHeader onBack={ () => Router.back() }
                     title={title}
                     subTitle={subTitle}/>;
};

export default Title;