import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";
const { Meta } = Card;
const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category, type } = course;
  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          className="mb-4 site-card-border-less-wrapper"
          // style={{background:'#fff'}}
          cover={
            <img
              src={image.Location}
              alt={name}
              style={{ height: "200px", width: "100%", objectFit: "cover" }}
              className="p-1"
            />
          }
        >
          <div style={{ minHeight: "200px" }}>
            <h6 className="font-weight-bold" style={{fontSize:'18px'}}>{name}</h6>
            <p>by {instructor.name}</p>
            <Badge count={category} className="pb-2 mr-2" />
            {/* <Badge count={type} className="pb-2 mr-2"/> */}
            <h5 className="pt-2">
              {paid
                ? currencyFormatter({
                    amount: price,
                    currency: "INR",
                  })
                : "Free"}
            </h5>
          </div>
        </Card>
      </a>
    </Link>
  );
};
export default CourseCard;
