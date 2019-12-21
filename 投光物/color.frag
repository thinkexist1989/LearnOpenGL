﻿#version 330 core
struct Material {
	sampler2D diffuse;
	sampler2D specular;
	float shiniess;
};

struct Light {
	vec3 position;
	vec3 direction;
	float cutOff;
	float outerCutOff;
	
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constant; // Kc
	float linear; //Kl
	float quadratic; //Kq
};


in vec3 Normal;
out vec4 FragColor;
in vec3 FragPos;

in vec2 TexCoords;

uniform vec3 viewPos; //观察者位置
uniform Material material;
uniform Light light;


void main()
{
	//环境光
	vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

	//漫反射
	vec3 norm = normalize(Normal);
	vec3 lightDir = normalize(light.position - FragPos);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

	//镜面反射
	vec3 viewDir = normalize(viewPos - FragPos);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shiniess);
	vec3 specular =light.specular * spec * texture(material.specular, TexCoords).rgb;

	//聚光（平滑边缘）
	float theta = dot(lightDir, normalize(-light.direction));
	float epsilon = (light.cutOff - light.outerCutOff);
	float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
	diffuse *= intensity;
	specular *= intensity;

	//衰减
	float distance = length(light.position - FragPos);
	float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * distance * distance);

	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	vec3 result = ambient + diffuse + specular;
	FragColor = vec4(result, 1.0);


	//点光源
//	//ambient
//	vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
//	//diffuse
//	vec3 norm = normalize(Normal);
//	//vec3 lightDir = normalize(-light.direction);
//	vec3 lightDir = normalize(light.position - FragPos);
//	float diff = max(dot(norm, lightDir), 0.0);
//	vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
//
//	//specular
//	vec3 viewDir = normalize(viewPos - FragPos);
//	vec3 reflectDir = reflect(-lightDir, norm);
//	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shiniess);
//	vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
//
//	//attenuation
//	float distance = length(light.position - FragPos);
//	float attenuation = 1.0/(light.constant + light.linear * distance + light.quadratic * distance * distance);
//
//	ambient  *= attenuation;
//	diffuse  *= attenuation;
//	specular *= attenuation;
//
//	vec3 result = ambient + diffuse + specular;
//    FragColor = vec4(result, 1.0);
}
