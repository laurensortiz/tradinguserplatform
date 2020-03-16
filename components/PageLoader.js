const pageLoader = <div className="page-loader">
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
         viewBox="0 0 70 70" enableBackground="new 0 0 0 0">
      <rect x="20" y="20" width="6" height="13" fill="#87d068">
        <animateTransform attributeType="xml"
                          attributeName="transform" type="translate"
                          values="0 0; 0 20; 0 0"
                          begin="0" dur="0.6s" repeatCount="indefinite"/>
      </rect>
      <rect x="30" y="20" width="6" height="13" fill="#f50">
        <animateTransform attributeType="xml"
                          attributeName="transform" type="translate"
                          values="0 0; 0 20; 0 0"
                          begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
      </rect>
      <rect x="40" y="20" width="6" height="13" fill="#87d068">
        <animateTransform attributeType="xml"
                          attributeName="transform" type="translate"
                          values="0 0; 0 20; 0 0"
                          begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
      </rect>
    </svg>
  </div>;

export default pageLoader;