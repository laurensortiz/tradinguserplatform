import React from 'react';
import CountUp from 'react-countup';

function StaticAmountBox({ title, value, icon }) {

  return (
    <>
      <div className="ant-statistic">
        <div className="ant-statistic-title">{title}</div>
        <div className="ant-statistic-content">
          <div className="prefix-icon">
            {icon}
          </div>

          <CountUp
            end={value.replace(',', '')}
            start={0}
            duration={3}
            decimals={2}
            delay={1}
            separator=","
            decimal="."
            prefix="$ "
          />

        </div>
      </div>
      <style jsx>{
        `
        .prefix-icon {
          display: inline-block;
          margin-right: 10px;
        }
        `
      }</style>
    </>
  );
}

export default StaticAmountBox;


