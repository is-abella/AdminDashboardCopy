const Card = ({ item } : any) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center">
          {item.map((Val : any) => {
            return (
              <div
                className="col-md-4 col-sm-6 card my-3 py-3 border-0"
                key={Val.id}
              >
                
                <div className="card-body">
                  <div className="card-title fw-bold fs-4">
                    {Val.title} &nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Card;