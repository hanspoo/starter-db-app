type ProgressBarProps = {
  bgcolor: string;
  progress: number;
  height: string;
};
const ProgressBar = ({ bgcolor, progress, height }: ProgressBarProps) => {
  const Parentdiv = {
    height: height,
    width: '100%',
    backgroundColor: 'whitesmoke',
    // borderRadius: 40,
    // margin: 50,
  };

  const Childdiv = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 0,
    textAlign: 'right' as any,
  };

  const progresstext = {
    padding: 10,
    color: 'white',
    fontWeight: 900,
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>{`${progress}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
