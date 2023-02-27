import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", ()=>{

    it("should throw error when id is empty", ()=>{
        expect(() => {
            let customer = new Customer("", "Teste");
        }).toThrowError("Id is required");
    })
    it("should throw error when nameS is empty", ()=>{
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    })
    it("should change name", () => {
        //Arrange
       const customer = new Customer("123", "John");

       // Act
       customer.changeName("Jane");
    
        //Assert
        expect(customer.name).toBe("Jane");
      });

     it("should active customer", () => {
        const customer = new Customer("123", "John");
        const address = new Address("Street 1", 123, "13330-023", "São Paulo");
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);
    }) 

    it("should deactivate customer", () => {
        const customer = new Customer("123", "John");
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    }) 
    
    it("should throw error when address is undefined when you activate a customer", () => {

        expect(() => {
            const customer = new Customer("123", "John");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
        

        
    })
})