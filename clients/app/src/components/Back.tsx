import { useSelector } from 'react-redux';
import { RootState } from 'srcPath/store';
import IconFont from './iconfont';

type BackProps = {
  back: () => void;
  title?: string;
  extra?: React.ReactNode;
};

const Back: React.FC<BackProps> = props => {
  const screen = useSelector((state: RootState) => state.app.screen);
  return (
    <div className="flex-row justify-between items-center">
      <div className="flex flex-row items-center">
        <div className='flex justify-center items-center h-12 w-12 rounded-md1' style={{backgroundColor: '#4A4A4F'}}>
          <div className='cursor-pointer' onClick={props.back}>
            <IconFont name="fanhui" size={24} color="#fff" />
          </div>
        </div>
        
        {props.title ? (
          <h1 className="text-white text-lg" style={{ lineHeight: screen.isSmall ? '30px' : '44px', marginLeft: 6 }}>
            {props.title}
          </h1>
        ) : null}
      </div>
      {props.extra}
    </div>
  );
};

export default Back;
