import BirthControlPagination from "./components/BirthControlPagination";
import Container from "@/components/shared/container"


export default function Page() {
  return (
    <Container title="Postpartum Care Dashboard">
      
      <div className="bg-gradient-to-br from-pink-100 to-pink-200 min-h-screen -m-5 p-5">
        
  

        {/* Header Section */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
nnnnnnnnnn
          </h1>
        </div>

        {/* Birth Control Section */}
        <div className="bg-gray-100 min-h-screen rounded-lg p-5">
          <h1 className="text-3xl font-bold text-center pt-5">
            Birth Control Methods
          </h1>

          <BirthControlPagination />
        </div>

      </div>

    </Container>
  );
}