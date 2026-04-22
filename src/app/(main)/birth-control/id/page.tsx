
import methods from "../../../api/birth-Controler/data/methods";
import { Method } from "../../../../../types/methods";

interface Props {
  params: { id: string };
}

export default function DetailsPage({ params }: Props) {
  const method: Method | undefined = methods.find(
    (m) => m.id === params.id
  );

  if (!method) {
    return <div className="p-10 text-center">Not found</div>;
  }

  return (
    <div className="p-10">
      <img
        src={method.image}
        alt={method.title}
        className="w-full max-w-xl mx-auto rounded-xl"
      />

      <h1 className="text-3xl font-bold mt-5 text-center">
        {method.title}
      </h1>

      <p className="text-center text-gray-600 mt-3">
        {method.description}
      </p>
    </div>
  );
}