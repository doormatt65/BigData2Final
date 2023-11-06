import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

const HomeTable = (props) => {
  return (
    <>
      <Image src="/test.jpg" fluid width={"150px"} />
      <br />
      <br />
      <Button>Add to cart</Button>
    </>
  );
};

export default HomeTable;
