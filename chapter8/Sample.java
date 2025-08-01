
class Parent {
    public void foo() throws Exception {
        // This method is intentionally left empty
    }
    public void bar() {
        // This method is intentionally left empty
    }
}

class Example extends Parent {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
    public void foo() throws IOException {
        // This method is intentionally left empty
    }
    public void bar() {
     try {
         foo();
     } catch (Exception e) {
         response.write("<div style='display:none'>" + e.toString() + "</div>");
     }
    }
}