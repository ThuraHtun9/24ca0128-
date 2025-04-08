package model;
public class Post{
    private String name;
    private String sex;
    private String message;
    private String fontColor;
    private String fontSize;
    private String fontWeight;
    public Post(String name, String sex, String message, String fontColor, String fontSize, String fontWeight){
        this.name = name;
        this.sex = sex;
        this.message = message;
        this.fontColor = fontColor;
        this.fontSize = fontSize;
        this.fontWeight = fontWeight;
    }
    public String getName(){
        return name;
    }
    public String getSex(){
        return sex;
    }
    public String getMessage(){
        return message;
    }
    public String getFontColor(){
        return fontColor;
    }
    public String getFontSize(){
        return fontSize;
    }
    public String getFontWeight(){
        return fontWeight;
    }
}